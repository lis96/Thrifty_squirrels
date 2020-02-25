const Logger = (function(){
	const defaultLoggerToConsole = {
		log:function(msg) {
			console.log(msg);
		}
	}
	class Decorator {
		constructor(wrappedLogger) {
			this.wrappedLogger = wrappedLogger;
		}
		log(msg) {
			this.wrappedLogger(msg);
		}
	}

	return defaultLoggerToConsole;
})();