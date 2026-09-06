import jwt from 'jsonwebtoken';
import { env } from './config.js';
import { User } from './models.js';
export function asyncHandler(fn){ 
    return (req,res,next)=>Promise.resolve(fn(req,res,next))
    .catch(next);
 }
export function notFound(req,res){
     res.status(404).json({message:`Route not found: ${req.method} ${req.originalUrl}`}); 
    }
export function errorHandler(err,req,res,next){
     console.error(err);
      const status=err.statusCode|| (err.name==='ValidationError'?400:500); 
     res.status(status).json({message:status===500?'Internal server error':err.message, ...(env.NODE_ENV!=='production'&&{stack:err.stack})}); 
    }
export function auth(requiredRoles=[]){ 
    return asyncHandler(async(req,res,next)=>{ 
        const header=req.headers.authorization;
         if(!header?.startsWith('Bearer ')){ 
            return res.status(401).json({message:'Authentication required'}); 
        } try { 
            const payload=jwt.verify(header.slice(7),env.JWT_SECRET); 
            const user=await User.findById(payload.sub); 
            if(!user) 
                return res.status(401).json({message:'User no longer exists'});
             if(requiredRoles.length&&!requiredRoles.includes(user.role)) 
                return res.status(403).json({message:'Insufficient permissions'}); 
            req.user=user;
             next();
         } catch {
             res.status(401).json({message:'Invalid or expired token'}); 
            } });
         }
export function signToken(user){ 
    return jwt.sign({sub:user._id.toString(),
        role:user.role},
        env.JWT_SECRET,
        {expiresIn:env.JWT_EXPIRES_IN}
    ); 
}