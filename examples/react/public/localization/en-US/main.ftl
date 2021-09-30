hello-world = <a>Hello</a>, world!
    .title = Hello, {$title}!
lights = there are {NUMBER($count)} lights
sub-title = Fluent is awesome.
click-me =
    .value = Click me!
alert-msg = This is a message that goes straight to JS.

# https://projectfluent.org/ - "complex things are possible"
shared-photos =
    {$userName} {NUMBER($photoCount) ->
        [one] added a new photo
       *[other] added {$photoCount} new photos
    } to {$userGender ->
        [male] his stream
        [female] her stream
       *[other] their stream
    }.