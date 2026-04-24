import { NextFunction, Request, Response, Router } from "express";
import authService from "./auth.service";
import { successResponse } from "../../common/response";
import { IConfirmEmailGeneric, IloginGeneric, ISignupGeneric } from "./auth.entity";
import { confirmEmailSchema, forgetPasswordSchema, loginSchema, resendConfirmEmailSchema, signupSchema } from "./auth.validation";
import { BadRequestException } from "../../common";
const router = Router()

router.post(
  '/signup',
  async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const result = await signupSchema.body.safeParseAsync(req.body);

    if (!result.success) {
      throw new BadRequestException("validation error", {
        cause: result.error.flatten(),
      });
    }
    const data = await authService.signup(req.body)
    return successResponse<ISignupGeneric>({

      res,
      message: "Account created successfully",
      status: 201,
      data
    })
  });
router.patch("/confirm-Email", async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const result = await confirmEmailSchema.body.safeParseAsync(req.body);
  if (result.success) {
    const data = await authService.confirmEmail(req.body)

    return successResponse<IConfirmEmailGeneric>({

      res,
      message: "email verified successfully",
      status: 200,
      data
    })
  }
  else {
    throw new BadRequestException("validation error", {
      cause: result.error.flatten(),
    });
  }
})
router.patch("/resend-confirm-email", async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
  const validation = await resendConfirmEmailSchema.body.safeParse(req.body)
  if (validation.success) {
    const data = await authService.reSendConfirmEmail(req.body)

    return successResponse<IConfirmEmailGeneric>({

      res,
      message: "email sent successfully",
      status: 200,
      data
    })
  }
  else {
    throw new BadRequestException("validation error", {
      cause: validation.error.flatten(),
    });
  }
}

)
router.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
const result = await loginSchema.body.safeParseAsync(req.body);
  if (result.success) {
    const data = await authService.login(req.body)

    return successResponse<IloginGeneric>({

      res,
      message: "login done succefully",
      status: 200,
      data
    })
  }
  else {
    throw new BadRequestException("validation error", {
      cause: result.error.flatten(),
    });
  }
})
router.patch('/forget-password-otp',async(req:Request,res:Response,next:NextFunction):Promise<Response>=>{
  const result = await forgetPasswordSchema.body.safeParseAsync(req.body);
  if (result.success) {
   await authService.forgetPasswordOTP(req.body)

    return successResponse({

      res,
      message: "password updated successfully",
      status: 200,
  
    })
  }
  else {
    throw new BadRequestException("validation error", {
      cause: result.error.flatten(),
    });
  }
})
router.patch('/forget-password',async(req:Request,res:Response,next:NextFunction):Promise<Response>=>{
  const result = await resendConfirmEmailSchema.body.safeParseAsync(req.body);
  if (result.success) {
   await authService.forgetPassword(req.body)

    return successResponse({

      res,
      message: "we have sent to you OTP",
      status: 200,
  
    })
  }
  else {
    throw new BadRequestException("validation error", {
      cause: result.error.flatten(),
    });
  }
})

export default router