define(function() {
    function RePreFetch(dataLoader, dataHandler, prefetchData) {
        var self = this;

        self._firstRun = true;

        self.init = function() {
            self.refresh();
        };

        self.refresh = function() {
            if (self._firstRun) {
                dataHandler(prefetchData, true);
            } else {
                dataHandler(dataLoader(), false);
            }

            self._firstRun = false;
        };
    }

    return RePreFetch;
});