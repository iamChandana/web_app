export default function createEmailVerifiedObj(formValues, clientDetails) {
    const emailVerifiedObj = {
        isEmailVerified: clientDetails.account[0]['isEmailVerified'],
        emailVerifiedAt: clientDetails.account[0]['emailVerifiedAt'],
    };
    return { ...formValues, ...emailVerifiedObj };
}