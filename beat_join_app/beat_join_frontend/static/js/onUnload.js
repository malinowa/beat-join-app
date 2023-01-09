window.addEventListener("unload", function() {
    this.navigator.sendBeacon("/api/delete-from-users-list");
})