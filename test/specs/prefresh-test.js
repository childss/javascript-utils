define(['_', 'prefresh'], function(_, Prefresh) {
    function Dummy() {
        var self = this;

        self.loaderFunc = function() {
        };
        self.dataHandler = function() {
        };
    }

    function dummySpy(funcName, inst) {
        var dummy = inst || new Dummy();

        spyOn(dummy, funcName);

        return dummy;
    }

    describe("Prefresh Library", function() {
        beforeEach(function() {
            jasmine.Ajax.useMock();
        });

        it("should call a user-supplied function on init with prefetch data", function() {
            var dummy = dummySpy('dataHandler');
            var prefetch = {
                data: 'yes'
            };

            var pf = new Prefresh(dummy.loaderFunc, dummy.dataHandler, prefetch);

            pf.init();

            expect(dummy.dataHandler).toHaveBeenCalledWith(prefetch, true);
        });

        it("should call a user-supplied loader function with the user-supplied handler function on refresh", function() {
            var dummy = dummySpy('dataHandler');
            var loadedData = { data: 'usually' };
            spyOn(dummy, 'loaderFunc').andReturn(loadedData);
            var pf = new Prefresh(dummy.loaderFunc, dummy.dataHandler, {});

            pf.init();
            pf.refresh();

            expect(dummy.loaderFunc).toHaveBeenCalledWith(dummy.dataHandler, false);
        });

        it("should call a user-supplied handler function with a value of true on the first call, and a loader function on subsequent calls", function() {
            var dummy = dummySpy('dataHandler');
            spyOn(dummy, 'loaderFunc').andReturn({});
            var pf = new Prefresh(dummy.loaderFunc, dummy.dataHandler, {});

            pf.init();
            expect(dummy.loaderFunc).not.toHaveBeenCalled();
            expect(dummy.dataHandler).toHaveBeenCalledWith({}, true);

            pf.refresh();
            expect(dummy.loaderFunc).toHaveBeenCalledWith(dummy.dataHandler, false);
            pf.refresh();
            expect(dummy.loaderFunc).toHaveBeenCalledWith(dummy.dataHandler, false);
        });

        it("init is an alias for refresh", function() {
            var dummy = dummySpy('dataHandler');
            var pf = new Prefresh(dummy.loaderFunc, dummy.dataHandler, {});
            spyOn(pf, 'refresh');

            pf.init();
            expect(pf.refresh).toHaveBeenCalled();
        });

        it("should call the user-supplied load function to get the initial data if not given prefetch data", function() {
            var dummy = dummySpy('dataHandler');
            spyOn(dummy, 'loaderFunc').andReturn({});
            var pf = new Prefresh(dummy.loaderFunc, dummy.dataHandler);

            pf.init();
            expect(dummy.loaderFunc).toHaveBeenCalledWith(dummy.dataHandler, true);
        });

        it("should make AJAX call if loader function returns an object", function() {
            var dummy = dummySpy('dataHandler');
            var expectedAjax = {
                url: '/some/url'
            };

            spyOn(dummy, 'loaderFunc').andReturn(expectedAjax);
            var pf = new Prefresh(dummy.loaderFunc, dummy.dataHandler);

            pf.init();

            expect(mostRecentAjaxRequest().url).toBe('/some/url');

            mostRecentAjaxRequest().response({ response: 200, responseText: '{"data":1}'});

            expect(dummy.dataHandler).toHaveBeenCalledWith({ data: 1 }, true);
        });

        it("should call the success function returned by the loader if it exists", function() {
            var dummy = dummySpy('dataHandler');
            var successCalled = false;
            var expectedAjax = {
                url: '/some/url',
                success: function() {
                    successCalled = true;
                }
            };

            spyOn(dummy, 'loaderFunc').andReturn(expectedAjax);
            var pf = new Prefresh(dummy.loaderFunc, dummy.dataHandler);

            pf.init();

            mostRecentAjaxRequest().response({ response: 200, responseText: '{"data":1}'});

            expect(successCalled).toBeTruthy();
            expect(dummy.dataHandler).toHaveBeenCalledWith({ data: 1 }, true);
        });
    });
});