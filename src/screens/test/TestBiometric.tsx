import React, { useEffect, useState } from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import { Alert, Button, Text, View } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { useBiometricAuth } from 'hooks/useBiometricAuth';

// BiometricAuth.tsx

export default function TestBiometric() {
    const {
        checkBiometricSupport,
        loadCredentialsWithBiometric,
        saveCredentialsWithBiometric,
        clearCredentials,
    } = useBiometricAuth();

    useEffect(() => {
        (async () => {
            const isCheck = await checkBiometricSupport();
            console.log('is check biometric support ', isCheck);
        })();
    }, []);

    return (
        <View style={{ padding: 24, marginTop: 100 }}>
            <Text style={{ fontSize: 18, marginBottom: 12, color: 'black' }}>
                {/* {biometryType ? `Thiết bị hỗ trợ: ${biometryType}` : 'Không hỗ trợ sinh trắc học'} */}
                HIHI
            </Text>
            <Button
                title="Set Pass"
                onPress={() => saveCredentialsWithBiometric('username', 'password')}
            />
            <Button title="Xác thực sinh trắc học" onPress={loadCredentialsWithBiometric} />
        </View>
    );
}
