declare function require(moduleName: string): any;

const { Router } = require("express");
const authController = require("./auth.controller");
const authOptionalModule = require("../../middleware/authOptional");

const authOptional =
  authOptionalModule.default ||
  authOptionalModule.authOptional ||
  authOptionalModule;

const router = Router();

/**
 * Public auth routes
 */
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/verify-email", authController.verifyEmail);
router.post("/send-mobile-otp", authController.sendMobileOtp);
router.post("/verify-mobile-otp", authController.verifyMobileOtp);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

/**
 * Protected / session-aware routes
 */
router.get("/me", authOptional, authController.getMe);
router.post(
  "/send-email-verification",
  authOptional,
  authController.sendEmailVerification
);

export default router;