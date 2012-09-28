define(['_', 'prefresh'], function(_, PreFresh) {
    function Dummy() {
        var self = this;

        self.loaderFunc = function() {};
        self.dataHandler = function() {};
    }

    function dummySpy(funcName, inst) {
        var dummy = inst || new Dummy();

        spyOn(dummy, funcName);

        return dummy;
    }

    describe("Prefresh Library", function() {
        it("should call a user-supplied function on init with prefetch data", function() {
            var dummy = dummySpy('dataHandler');
            var prefetch = {
                data: 'yes'
            };

            var pf = new PreFresh(dummy.loaderFunc, dummy.dataHandler, prefetch);

            pf.init();

            expect(dummy.dataHandler).toHaveBeenCalledWith(prefetch, true);
        });

        it("should call a user-supplied function on refresh with data from the user-supplied load function", function() {
            var dummy = dummySpy('dataHandler');
            var loadedData = { data: 'usually' };
            spyOn(dummy, 'loaderFunc').andReturn(loadedData);
            var pf = new PreFresh(dummy.loaderFunc, dummy.dataHandler, {});

            pf.init();
            pf.refresh();

            expect(dummy.dataHandler).toHaveBeenCalledWith(loadedData, false);
        });

        it("should call a user-supplied function with a value of true on the first call, and false on subsequent calls", function() {
            var dummy = dummySpy('dataHandler');
            spyOn(dummy, 'loaderFunc').andReturn({});
            var pf = new PreFresh(dummy.loaderFunc, dummy.dataHandler, {});

            pf.init();
            expect(dummy.loaderFunc).not.toHaveBeenCalled();
            expect(dummy.dataHandler).toHaveBeenCalledWith({}, true);

            pf.refresh();
            expect(dummy.loaderFunc).toHaveBeenCalled();
            expect(dummy.dataHandler).toHaveBeenCalledWith({}, false);
            pf.refresh();
            expect(dummy.loaderFunc).toHaveBeenCalled();
            expect(dummy.dataHandler).toHaveBeenCalledWith({}, false);
        });

        it("init is an alias for refresh", function() {
            var dummy = dummySpy('dataHandler');
            var pf = new PreFresh(dummy.loaderFunc, dummy.dataHandler, {});
            spyOn(pf, 'refresh');

            pf.init();
            expect(pf.refresh).toHaveBeenCalled();
        });
    });
});