NodeList.prototype.setAttribute = function (name, value) {
    this.forEach((element) => {
        element.setAttribute(name, value);
    });
};

Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) < 0;
    });
};