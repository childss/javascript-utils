define(['_', 'prefresh'], function(_, Prefresh) {
    describe("Prefresh Library", function() {
        var loaderFunc, dataHandler;

        beforeEach(function() {
            jasmine.Ajax.useMock();

            loaderFunc = jasmine.createSpy();
            dataHandler = jasmine.createSpy();
        });

        it("should call a user-supplied function on init with prefetch data", function() {
            var prefetch = {
                data: 'yes'
            };

            var pf = new Prefresh(loaderFunc, dataHandler, prefetch);

            pf.init();

            expect(dataHandler).toHaveBeenCalledWith(prefetch, true);
        });

        it("should call a user-supplied loader function with the user-supplied handler function on refresh", function() {
            var pf = new Prefresh(loaderFunc, dataHandler, {});

            pf.init();
            pf.refresh();

            expect(loaderFunc).toHaveBeenCalledWith(dataHandler, false);
        });

        it("should call a user-supplied handler function with a value of true on the first call, and a loader function on subsequent calls", function() {
            var pf = new Prefresh(loaderFunc, dataHandler, {});

            pf.init();
            expect(loaderFunc).not.toHaveBeenCalled();
            expect(dataHandler).toHaveBeenCalledWith({}, true);

            pf.refresh();
            expect(loaderFunc).toHaveBeenCalledWith(dataHandler, false);
            pf.refresh();
            expect(loaderFunc).toHaveBeenCalledWith(dataHandler, false);
        });

        it("init is an alias for refresh", function() {
            var pf = new Prefresh(loaderFunc, dataHandler, {});
            spyOn(pf, 'refresh');

            pf.init();
            expect(pf.refresh).toHaveBeenCalled();
        });

        it("should call the user-supplied load function to get the initial data if not given prefetch data", function() {
            var pf = new Prefresh(loaderFunc, dataHandler);

            pf.init();
            expect(loaderFunc).toHaveBeenCalledWith(dataHandler, true);
        });

        it("should make AJAX call if loader function returns an object", function() {
            var expectedAjax = {
                url: '/some/url'
            };

            loaderFunc.andReturn(expectedAjax);
            var pf = new Prefresh(loaderFunc, dataHandler);

            pf.init();

            expect(mostRecentAjaxRequest().url).toBe('/some/url');

            mostRecentAjaxRequest().response({ response: 200, responseText: '{"data":1}'});

            expect(dataHandler).toHaveBeenCalledWith({ data: 1 }, true);
        });

        it("should call the success function returned by the loader if it exists", function() {
            var successCalled = false;
            var expectedAjax = {
                url: '/some/url',
                success: function() {
                    successCalled = true;
                }
            };

            loaderFunc.andReturn(expectedAjax);
            var pf = new Prefresh(loaderFunc, dataHandler);

            pf.init();

            mostRecentAjaxRequest().response({ response: 200, responseText: '{"data":1}'});

            expect(successCalled).toBeTruthy();
            expect(dataHandler).toHaveBeenCalledWith({ data: 1 }, true);
        });
    });
});