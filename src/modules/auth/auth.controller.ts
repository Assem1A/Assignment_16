import { NextFunction, Request, Response, Router } from "express";
import authService from "./auth.service";
import { successResponse } from "../../common/response";
import { IConfirmEmailGeneric, IloginGeneric, ISignupGeneric } from "./auth.entity";
import { confirmEmailSchema, forgetPasswordSchema, loginSchema, resendConfirmEmailSchema, signupSchema } from "./auth.validation";
import { validation } from "../../middleware";
const router = Router()

router.post(
  '/signup',
  validation(signupSchema)
  ,
  async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        console.log("gender");
    const data = await authService.signup(req.body)
            console.log("gender");
    return successResponse<ISignupGeneric>({

      res,
      message: "Account created successfully",
      status: 201,
      data
    })
  });
router.patch("/confirm-Email", validation(confirmEmailSchema), async (req: Request, res: Response, next: NextFunction): Promise<Response> => {

  const data = await authService.confirmEmail(req.body)

  return successResponse<IConfirmEmailGeneric>({

    res,
    message: "email verified successfully",
    status: 200,
    data
  })


})
router.patch("/resend-confirm-email", validation(resendConfirmEmailSchema), async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  {
    const data = await authService.reSendConfirmEmail(req.body)

    return successResponse<IConfirmEmailGeneric>({

      res,
      message: "email sent successfully",
      status: 200,
      data
    })
  }

}

)
router.post("/login", validation(loginSchema), async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  {
    const data = await authService.login(req.body)

    return successResponse<IloginGeneric>({

      res,
      message: "login done succefully",
      status: 200,
      data
    })
  }

})
router.patch('/forget-password-otp', validation(forgetPasswordSchema), async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  {
    await authService.forgetPasswordOTP(req.body)

    return successResponse({

      res,
      message: "password updated successfully",
      status: 200,

    })
  }

})
router.patch('/forget-password',validation(resendConfirmEmailSchema), async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
 
    await authService.forgetPassword(req.body)

    return successResponse({

      res,
      message: "we have sent to you OTP",
      status: 200,

    })
  
 
})

export default router