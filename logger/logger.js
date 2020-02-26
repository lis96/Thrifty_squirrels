const Logger = (() => {
	/*
		Формируем логгер
	*/
	const defaultLoggerToConsole = {
		/*
			Простое логгирование в консоль
		*/
		log:function(msg) {
			console.log(msg);
		}
	}
	class Decorator {
		/*
			Класс декоратора для расширения логгера
		*/
		constructor(wrappedLogger, logging) {
			this.wrapped = wrappedLogger;
			if (typeof logging !== 'function') {
				throw 'Wrong type of logging in logger extension';
			}
			this.logging = logging;
		}
		log(msg) {
			this.wrapped.log(msg);
			this.logging(msg);
		}
	}

	return defaultLoggerToConsole;
})();