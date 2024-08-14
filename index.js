import { Amplify } from "aws-amplify";
import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  resetPassword,
  confirmResetPassword,
  updateUserAttributes,
  confirmSignUp,
} from "aws-amplify/auth";

// Configure Amplify
Amplify.configure({
  Auth: {
    Cognito: {
      region: "ap-southeast-1",
      userPoolId: "ap-southeast-1_3Y41qeyV3",
      userPoolClientId: "23ug73r81fv6qea3dvo11u6rb1",
    },
  },
});

// Utility functions
function getElement(id) {
  return document.getElementById(id);
}

function setMessage(message) {
  getElement("message").textContent = message;
}

// Sign up function
async function handleSignUp() {
  const username = getElement("signupUsername").value;
  const password = getElement("signupPassword").value;
  const email = getElement("signupEmail").value;

  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });
    console.log("Sign up successful:", isSignUpComplete, userId, nextStep);
    setMessage(
      "Sign up successful! Please check your email for a confirmation code.",
    );
    // Show confirmation input
    getElement("confirmSignupSection").style.display = "block";
  } catch (error) {
    console.error("Error signing up:", error);
    setMessage(`Sign up failed: ${error.message}`);
  }
}

// Confirm sign up function
async function handleConfirmSignUp() {
  const username = getElement("signupUsername").value;
  const confirmationCode = getElement("confirmationCode").value;

  try {
    const { isSignUpComplete } = await confirmSignUp({
      username,
      confirmationCode,
    });
    console.log("Confirmation successful:", isSignUpComplete);
    setMessage("Account confirmed successfully! You can now sign in.");
    // Hide confirmation input
    getElement("confirmSignupSection").style.display = "none";
  } catch (error) {
    console.error("Error confirming sign up:", error);
    setMessage(`Confirmation failed: ${error.message}`);
  }
}

// Sign in function
async function handleSignIn() {
  const username = getElement("signinUsername").value;
  const password = getElement("signinPassword").value;

  try {
    const { isSignedIn, nextStep } = await signIn({ username, password });
    console.log("Sign in successful:", isSignedIn, nextStep);
    setMessage("Sign in successful!");
    await handleGetCurrentUser();
  } catch (error) {
    console.error("Error signing in:", error);
    setMessage(`Sign in failed: ${error.message}`);
  }
}

// Get current authenticated user function
async function handleGetCurrentUser() {
  try {
    const user = await getCurrentUser();
    console.log("Current user:", user);
    setMessage(`Current user: ${user.username}`);
  } catch (error) {
    console.error("Error getting current user:", error);
    setMessage("No authenticated user");
  }
}

// Sign out function
async function handleSignOut() {
  try {
    await signOut();
    console.log("Signed out successfully");
    setMessage("Signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
    setMessage(`Error signing out: ${error.message}`);
  }
}

// Forgot password function
async function handleForgotPassword() {
  const username = getElement("forgotPasswordUsername").value;
  try {
    const { nextStep } = await resetPassword({ username });
    console.log("Password reset initiated:", nextStep);
    setMessage("Password reset code sent to your email");
  } catch (error) {
    console.error("Error initiating password reset:", error);
    setMessage(`Error initiating password reset: ${error.message}`);
  }
}

// Confirm password reset function
async function handleConfirmPasswordReset() {
  const username = getElement("resetPasswordUsername").value;
  const confirmationCode = getElement("resetPasswordCode").value;
  const newPassword = getElement("newPassword").value;
  try {
    const { isSuccess } = await confirmResetPassword({
      username,
      confirmationCode,
      newPassword,
    });
    console.log("Password reset successful:", isSuccess);
    setMessage("Password reset successful");
  } catch (error) {
    console.error("Error resetting password:", error);
    setMessage(`Error resetting password: ${error.message}`);
  }
}

// Get user attributes
async function handleGetUserAttributes() {
  try {
    const user = await getCurrentUser();
    console.log("User attributes:", user.attributes);
    setMessage(`User attributes: ${JSON.stringify(user.attributes)}`);
  } catch (error) {
    console.error("Error getting user attributes:", error);
    setMessage(`Error getting user attributes: ${error.message}`);
  }
}

// Update user attributes
async function handleUpdateUserAttributes() {
  const attributeName = getElement("attributeName").value;
  const attributeValue = getElement("attributeValue").value;
  try {
    const result = await updateUserAttributes({
      userAttributes: {
        [attributeName]: attributeValue,
      },
    });
    console.log("User attribute updated successfully:", result);
    setMessage("User attribute updated successfully");
  } catch (error) {
    console.error("Error updating user attribute:", error);
    setMessage(`Error updating user attribute: ${error.message}`);
  }
}

// Add event listeners
document.addEventListener("DOMContentLoaded", () => {
  getElement("signupButton").addEventListener("click", handleSignUp);
  getElement("confirmSignupButton").addEventListener(
    "click",
    handleConfirmSignUp,
  );
  getElement("signinButton").addEventListener("click", handleSignIn);
  getElement("getCurrentUserButton").addEventListener(
    "click",
    handleGetCurrentUser,
  );
  getElement("signoutButton").addEventListener("click", handleSignOut);
  getElement("forgotPasswordButton").addEventListener(
    "click",
    handleForgotPassword,
  );
  getElement("resetPasswordButton").addEventListener(
    "click",
    handleConfirmPasswordReset,
  );
  getElement("getUserAttributesButton").addEventListener(
    "click",
    handleGetUserAttributes,
  );
  getElement("updateUserAttributeButton").addEventListener(
    "click",
    handleUpdateUserAttributes,
  );
});
