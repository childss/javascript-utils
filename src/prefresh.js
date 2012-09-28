define(function(require) {
    var $ = require('jquery');

    function Prefresh(dataLoader, dataHandler, prefetchData) {
        var self = this;

        self._firstRun = true;

        self.init = function() {
            self.refresh();
        };

        self.refresh = function() {
            var wasFirstRun = self._firstRun;
            self._firstRun = false;

            if (wasFirstRun && prefetchData) {
                dataHandler(prefetchData, wasFirstRun);
            } else {
                var result = dataLoader(dataHandler, wasFirstRun);

                if (typeof result === 'object') {
                    var originalSuccess = result.success;
                    result.success = function(data) {
                        if (typeof originalSuccess === 'function') {
                            originalSuccess(data);
                        }

                        dataHandler(data, wasFirstRun);
                    };

                    $.ajax(result);
                }
            }
        };
    }

    return Prefresh;
});