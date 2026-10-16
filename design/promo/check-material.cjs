// V2.4 uses the same browser/state fixtures as the application regression check.
require('./check-app.cjs').main({materialOnly:true}).catch(error=>{console.error(error);process.exitCode=1;});
