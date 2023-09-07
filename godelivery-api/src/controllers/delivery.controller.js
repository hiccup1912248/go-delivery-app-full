const Order = require("../models/order");
const Delivery_man = require("../models/delivery_man");
const {
  hash: hashPassword,
  compare: comparePassword,
} = require("../utils/password");
const { generate: generateToken } = require("../utils/token");
const { Op } = require("sequelize");

exports.signup = async (req, res) => {
  try {
    const { name, phone, password, motor } = req.body;
    const hashedPassword = hashPassword(password.trim());

    const delivery_man = await Delivery_man.create({
      phone: phone,
      name: name,
      password: hashedPassword,
      motor: motor,
    });

    res.status(200).send({
      success: true,
      code: 200,
      message: "signup success",
      data: delivery_man.toJSON(),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  } finally {
  }
};

exports.signin = async (req, res) => {
  try {
    const { phone, password } = req.body;
    // Search for a record with the provided phone number
    const delivery_man = await Delivery_man.findOne({
      where: { phone: phone },
      include: {
        model: Order,
        as: "orders",
      },
    });

    // Check if the phone number exists in the database
    if (delivery_man) {
      if (comparePassword(password.trim(), delivery_man.password)) {
        const token = generateToken(delivery_man.id);
        res.status(200).send({
          success: true,
          code: 200,
          message: "Signin Success",
          data: {
            token,
            delivery_man,
          },
        });
        return;
      }
      res.status(200).send({
        success: false,
        code: 401,
        message: "Incorrect password",
      });
    } else {
      res.status(200).send({
        success: false,
        code: 400,
        message: `User with phone ${phone} was not found`,
      });
    }
  } catch (error) {
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
};

exports.totalcount = async (req, res) => {
  try {
    const { count, clients } = await Delivery_man.findAndCountAll({});

    res.status(200).send({
      success: true,
      code: 200,
      message: "success receive",
      data: {
        totalcount: count,
      },
    });
  } catch (error) {
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
};

exports.orderList = async (req, res) => {
  try {
    const { deliverymanID } = req.body;
    const orders = await Order.findAll({
      where: {
        deliverymanID: deliverymanID,
      },
    });

    res.status(200).send({
      success: true,
      code: 200,
      data: {
        orders,
      },
    });
  } catch (error) {
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { deliverymanID } = req.body;
    const deliveryman = await Delivery_man.findOne({
      where: {
        id: deliverymanID,
      },
    });

    if (deliveryman) {
      // If the client is found, delete it from the database
      await deliveryman.destroy();
      res.status(200).send({
        success: true,
        code: 200,
        message: "Delete success",
        data: {
          deliveryman,
        },
      });
    } else {
      res.status(200).send({
        success: false,
        code: 200,
        message: "Deliveryman not found",
      });
    }
  } catch (error) {
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
};

exports.updateFcmToken = async (req, res) => {
  try {
    const { deliverymanID, fcmToken } = req.body;
    const deliveryman = await Delivery_man.findOne({
      where: {
        id: deliverymanID,
      },
    });

    if (deliveryman) {
      // If the client is found, update it from the database
      await Delivery_man.update(
        { fcmToken: fcmToken },
        {
          where: { id: deliverymanID },
        }
      );
      res.status(200).send({
        success: true,
        code: 200,
        message: "Update success",
        data: {
          deliveryman,
        },
      });
    } else {
      res.status(200).send({
        success: false,
        code: 200,
        message: "Deliveryman not found",
      });
    }
  } catch (error) {
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
};

exports.updateState = async (req, res) => {
  try {
    const { deliverymanID } = req.body;

    const deliveryman = await Delivery_man.findOne({
      where: {
        id: deliverymanID,
      },
    });

    const orders = await Order.findOne({
      where: {
        [Op.and]: [
          { deliverymanID: deliverymanID },
          {
            [Op.or]: [
              { status: 1 },
              { status: 2 },
            ]
          }
        ]
      },
    });

    if (deliveryman) {
      if (orders) {
        res.status(200).send({
          success: false,
          code: 200,
          message: "There is an order assigned to you. Please complete your work.",
        });
      } else {
        // If the client is found, delete it from the database
        const updatedStatus = deliveryman.status === 1 ? 0 : 1;

        // Update the status column in the database
        await Delivery_man.update(
          { status: updatedStatus },
          {
            where: { id: deliverymanID },
          }
        );
        res.status(200).send({
          success: true,
          code: 200,
          message: "Status update success",
        });
      }

    } else {
      res.status(200).send({
        success: false,
        code: 400,
        message: "Deliveryman not found",
      });
    }
  } catch (error) {
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
};

exports.deliverymanList = async (req, res) => {
  try {
    const { name, phone, startDate, endDate, pageNo, pageSize } = req.body;

    // Build the where condition based on the provided criteria
    const whereCondition = {};
    if (name !== undefined) {
      whereCondition.name = name;
    }
    if (phone !== undefined) {
      whereCondition.phone = phone;
    }
    if (startDate !== undefined && endDate !== undefined) {
      whereCondition.createdAt = {
        [Op.between]: [startDate, endDate],
      };
    }

    // Find orders that match the provided criteria
    const deliverymans = await Delivery_man.findAll({
      where: whereCondition,
      include: [
        {
          model: Order,
          as: "orders",
        },
      ],
    });
    res.status(200).send({
      success: true,
      code: 200,
      message: "Deliverymanlist success",
      data: deliverymans,
    });
  } catch (error) {
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { deliverymanID, locationLatitude, locationLongitude } = req.body;

    const deliveryman = await Delivery_man.findOne({
      where: {
        id: deliverymanID,
      },
    });

    if (deliveryman) {
      // If the client is found, delete it from the database
      const updatedStatus = deliveryman.status === 1 ? 0 : 1;

      // Update the status column in the database
      await Delivery_man.update(
        {
          locationLatitude: locationLatitude,
          locationLongitude: locationLongitude,
        },
        {
          where: { id: deliverymanID },
        }
      );
      res.status(200).send({
        success: true,
        code: 200,
        message: "location update success",
      });
    } else {
      res.status(200).send({
        success: false,
        code: 400,
        message: "Deliveryman not found",
      });
    }
  } catch (error) {
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
};

exports.getDeliveryManById = async (req, res) => {
  try {
    const deliverymanID = req.params.id;
    const deliveryman = await Delivery_man.findOne({
      where: { id: deliverymanID },
      include: [
        {
          model: Order,
          as: "orders",
        },
      ],
    });
    res.status(200).send({
      success: true,
      code: 200,
      message: "Get deliveryman Detail Success",
      data: deliveryman,
    });
  } catch (error) {
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { deliverymanID, name, phone, password, avatar } = req.body;

    const deliveryman = await Delivery_man.findOne({
      where: {
        id: deliverymanID,
      },
    });

    const updateData = {};
    if (name !== undefined) {
      updateData.name = name;
    }
    if (phone !== undefined) {
      updateData.phone = phone;
    }
    if (password !== undefined) {
      updateData.password = hashPassword(password.trim());;
    }
    if (avatar !== undefined) {
      updateData.avatar = avatar;
    }

    if (deliveryman) {
      // Update the status column in the database
      await Delivery_man.update(
        updateData,
        {
          where: { id: deliverymanID },
        }
      );

      const userData = await Delivery_man.findOne({
        where: {
          id: deliverymanID,
        },
      });

      res.status(200).send({
        success: true,
        code: 200,
        message: "user data updated successfully",
        data: userData
      });
    } else {
      res.status(200).send({
        success: false,
        code: 400,
        message: "Deliveryman not found",
      });
    }
  } catch (error) {
    res.status(200).send({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
};