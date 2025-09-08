import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Message } from 'const/index';
import { sendSentryError } from 'utils/storeHelpers';

const useAuthPhoneNumber = () => {
    //send sms code
    const send = async (
        phoneNumber: string,
        onSuccess: (p: FirebaseAuthTypes.PhoneAuthSnapshot) => void,
        onError: (e: any) => void
    ) => {
        try {
            auth()
                .verifyPhoneNumber(phoneNumber)
                .on('state_changed', async (phoneAuthSnapshot) => {
                    //check state
                    if (phoneAuthSnapshot.state === auth.PhoneAuthState.CODE_SENT) {
                        onSuccess(phoneAuthSnapshot);
                    }
                })
                .then(() => {
                    return true;
                })
                .catch((e: any) => {
                    onError(e);
                });
        } catch (error: any) {
            console.log('error send sms ', error);
            onError(error);
            sendSentryError(error, 'handleSendOtpCode*');
        }
    };
    //verify sms code
    const verify = (
        phoneAuthSnapshotState: FirebaseAuthTypes.PhoneAuthSnapshot | null,
        code: string,
        actionSuccess: (response: FirebaseAuthTypes.UserCredential) => any,
        actionFailed: (error: string) => any
    ) => {
        if (phoneAuthSnapshotState) {
            //create credential object
            const credential = auth.PhoneAuthProvider.credential(
                phoneAuthSnapshotState.verificationId,
                code
            );
            //verify sms code with Credential
            return auth()
                .signInWithCredential(credential)
                .then(async (response) => {
                    actionSuccess(response);
                })
                .catch((e) => {
                    if (e.code === 'auth/invalid-credential') {
                        actionFailed(Message.VERIFY_PHONE_CODE_INVALID);
                    } else if (e.code === 'auth/invalid-verification-code') {
                        actionFailed(Message.VERIFY_PHONE_CODE_INVALID);
                    } else if (e.code === 'auth/code-expired') {
                        actionFailed(Message.VERIFY_PHONE_CODE_EXPIRED);
                    } else {
                        actionFailed(Message.SYSTEMS_ERROR);
                    }
                });
        }
    };
    return {
        send,
        verify,
    };
};

export default useAuthPhoneNumber;
