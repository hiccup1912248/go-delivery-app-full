import { createDrawerNavigator } from '@react-navigation/drawer';

import TabNavigator from './TabNavigator';
import GoDeliveryColors from '../styles/colors';
import DrawerMenu from '../components/DrawerMenu';
import ProfileScreen from '../screens/settings/Profile'


const Drawer = createDrawerNavigator();

function DrawerNavigator(): JSX.Element {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    width: '80%',
                    backgroundColor: GoDeliveryColors.primary
                },
                drawerActiveTintColor: GoDeliveryColors.green,
                drawerInactiveTintColor: GoDeliveryColors.white
            }}
            drawerContent={props => <DrawerMenu {...props} />}
        >
            <Drawer.Screen name="Home" component={TabNavigator} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
    )
}

export default DrawerNavigator;