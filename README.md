Javascript Utils
================

A place to collect small useful Javascript libraries.

Prefresh
--------

When not writing Javascript in the new hotness style of partial reloads, you might end up doing a nifty AJAX POST but
then end up running a page refresh because it's easy. Well, Prefresh aims to make it as easy to *not* do that. Give it
a function to load some data, a function to act on that data, and (optionally) some initial data and it will:

1. Provide the initial data to the handler function on the first call to `refresh()`.
    * If no initial data is provided (or is given a non-true value), it will call the loader function to get the initial data.
2. On subsequent calls to `refresh()`, it will call the loader.

The loader function will be called with the handler function and the prefetch state (true if the first call to init/refresh,
false otherwise). With this you can call the handler callback yourself from an inline `success` function in a `jQuery.ajax`
call, for example.

The second, and more automagic, way to use a loader function is to return the object you would hand to `jQuery.ajax` from
the loader function. Prefresh will make the call, and pass the results on to the handler function. It'll also call the
`success` function on the `jQuery.ajax` parameter object, if it exists.