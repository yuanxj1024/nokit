"use strict";function killAll(e,r,i){var c={};try{Object.keys(e).forEach(function(i){e[i].forEach(function(e){c[e]||(killPid(e,r),c[e]=1)}),c[i]||(killPid(i,r),c[i]=1)})}catch(e){if(i)return i(e);throw e}if(i)return i()}function killPid(e,r){try{process.kill(parseInt(e,10),r)}catch(e){if("ESRCH"!==e.code)throw e}}function buildProcessTree(e,r,i,c,n){var t=c(e),o="";t.stdout.on("data",function(e){var e=e.toString("ascii");o+=e});var s=function(t){return delete i[e],0!=t?void(0==Object.keys(i).length&&n()):void o.match(/\d+/g).forEach(function(t){t=parseInt(t,10),r[e].push(t),r[t]=[],i[t]=1,buildProcessTree(t,r,i,c,n)})};t.on("close",s)}var childProcess=require("child_process"),spawn=childProcess.spawn,exec=childProcess.exec;module.exports=function(e,r,i){var c={},n={};switch(c[e]=[],n[e]=1,process.platform){case"win32":exec("taskkill /pid "+e+" /T /F",i);break;case"darwin":buildProcessTree(e,c,n,function(e){return spawn("pgrep",["-P",e])},function(){killAll(c,r,i)});break;default:buildProcessTree(e,c,n,function(e){return spawn("ps",["-o","pid","--no-headers","--ppid",e])},function(){killAll(c,r,i)})}};