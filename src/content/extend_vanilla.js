NodeList.prototype.setAttribute = function (name, value) {
    this.forEach((element) => {
        element.setAttribute(name, value);
    });
};

NodeList.prototype.remove = function () {
    this.forEach((element) => {
        element.remove();
    });
};

Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) < 0;
    });
};