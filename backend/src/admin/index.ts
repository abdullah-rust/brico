import Router from "express";
import LoginAdmin from "./login";
import SignUpAdmin from "./signup";
import VerifyAdminSignup from "./verification";

const AdminRoutes = Router();

AdminRoutes.post("/admin-login", LoginAdmin);
AdminRoutes.post("/admin-signup", SignUpAdmin);
AdminRoutes.post("/admin-OTP", VerifyAdminSignup);

export default AdminRoutes;
