import { CommonActions, NavigationContainerRef, StackActions } from '@react-navigation/native';
import * as React from 'react';

export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export function navigate(name?: any, params?: any) {
    navigationRef.current?.navigate(name, params);
}

export function replace(name: any, params?: any) {
    navigationRef.current?.dispatch(
        StackActions.replace(name, {
            params,
        })
    );
}

// export function navigate(routeName, params) {
//   navigationRef.current.dispatch(
//     CommonActions.navigate({
//       name: routeName,
//       params: {
//         params
//       },
//     })
//   );
// }

export function goBack() {
    navigationRef.current?.goBack();
}

export function goBackDispatch() {
    navigationRef.current?.dispatch(CommonActions.goBack());
}

export function push(name: any, params?: any) {
    navigationRef.current?.dispatch(StackActions.push(name, params));
}

export function pop() {
    navigationRef.current?.dispatch(StackActions.pop());
}

export function reset(index?: any, route?: any) {
    navigationRef.current?.dispatch(
        CommonActions.reset({
            index: index,
            routes: route,
        })
    );
}

// CommonActions.reset({
//   index: 1,
//   routes: [
//     { name: 'Home' },
//     {
//       name: 'Profile',
//       params: { user: 'jane' },
//     },
//   ],
// })

// RootNavigation.reset(0,
//   [
//       {
//           name: "ProductStack",
//           params: {
//               name: "ProductScreen",
//               params: {
//                   id: id,
//                   index: this.props.index
//               }

//           }
//       },
//       {name:"HomeStack"}
//   ]
// )
