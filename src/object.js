/**
 * @constructor
 * Sk.builtin.object
 *
 * @description
 * Constructor for Python object. All Python classes (builtin and user-defined)
 * should inherit from this class.
 *
 * @return {Sk.builtin.object} Python object
 */
Sk.builtin.object = function () {
    if (!(this instanceof Sk.builtin.object)) {
        return new Sk.builtin.object();
    }

    return this;
};

Sk.builtin.type.$makeIntoTypeObj("object", Sk.builtin.object);
Object.setPrototypeOf(Sk.builtin.type.prototype, Sk.builtin.object.prototype);

Sk.builtin.object.prototype.__init__ = function __init__() {
    return Sk.builtin.none.none$;
};
Sk.builtin.object.prototype.__init__.co_kwargs = 1;

Sk.builtin._tryGetSubscript = function(dict, pyName) {
    try {
        return dict.mp$subscript(pyName);
    } catch (x) {
        return undefined;
    }
};
Sk.exportSymbol("Sk.builtin._tryGetSubscript", Sk.builtin._tryGetSubscript);

Sk.builtin.object.prototype.tp$getsets = [
    new Sk.GetSetDef("__class__",
                     function () {
                         return this.ob$type;
                     },
                     function (value) {
                         if (!Sk.builtin.checkClass(value)) {
                             throw new Sk.builtin.TypeError("__class__ must be set to a class, not '" + Sk.abstr.typeName(value) + "' object");
                         }
                         if (!this.hp$type || !value.sk$klass) {
                             throw new Sk.builtin.TypeError(" __class__ assignment only supported for heap types or ModuleType subclasses");
                         }
                         Object.setPrototypeOf(this, value.prototype);
                         return;
                     },
                     "the object's class"
    )
];



Sk.builtin.object.prototype.GenericPythonGetAttr = function(self, pyName) {
    if (!Sk.builtin.checkString(pyName)) {
        throw new Sk.builtin.TypeError("attribute name must be string, not '"+Sk.abstr.typeName(pyName)+"'");
    }
    var r = Sk.builtin.object.prototype.GenericGetAttr.call(self, pyName, true);
    if (r === undefined) {
        throw new Sk.builtin.AttributeError(pyName);
    }
    return r;
};
Sk.exportSymbol("Sk.builtin.object.prototype.GenericPythonGetAttr", Sk.builtin.object.prototype.GenericPythonGetAttr);


Sk.builtin.object.prototype.GenericPythonSetAttr = function(self, pyName, value) {
    if (!Sk.builtin.checkString(pyName)) {
        throw new Sk.builtin.TypeError("attribute name must be string, not '"+Sk.abstr.typeName(pyName)+"'");
    }
    return Sk.builtin.object.prototype.GenericSetAttr.call(self, pyName, value, true);
};
Sk.exportSymbol("Sk.builtin.object.prototype.GenericPythonSetAttr", Sk.builtin.object.prototype.GenericPythonSetAttr);

Sk.builtin.object.prototype.HashNotImplemented = function () {
    throw new Sk.builtin.TypeError("unhashable type: '" + Sk.abstr.typeName(this) + "'");
};

Sk.builtin.object.prototype.tp$getattr = Sk.builtin.GenericGetAttr;
Sk.builtin.object.prototype.tp$setattr = Sk.builtin.GenericSetAttr;

// Although actual attribute-getting happens in pure Javascript via tp$getattr, classes
// overriding __getattribute__ etc need to be able to call object.__getattribute__ etc from Python
Sk.builtin.object.prototype["__getattribute__"] = Sk.builtin.object.prototype.GenericPythonGetAttr;
Sk.builtin.object.prototype["__setattr__"] = Sk.builtin.object.prototype.GenericPythonSetAttr;

/**
 * The name of this class.
 * @type {string}
 */
Sk.builtin.object.prototype.tp$name = "object";

/**
 * The type object of this class.
 * @type {Sk.builtin.type|Object}
 */
Sk.builtin.object.prototype.ob$type.sk$klass = undefined;   // Nonsense for closure compiler
Sk.builtin.object.prototype.tp$descr_set = undefined;   // Nonsense for closure compiler

/** Default implementations of dunder methods found in all Python objects */
/**
 * Default implementation of __new__ just calls the class constructor
 * @name  __new__
 * @memberOf Sk.builtin.object.prototype
 * @instance
 */

Sk.builtin.object.prototype["__new__"] = function (cls) {
    Sk.builtin.pyCheckArgsLen("__new__", arguments.length, 1, 1, false, false);

    return new cls([], []);
};

Sk.builtin.object.prototype.tp$new = function (args, kwargs) {
    // see cypthon object_new for reasoning behind errors  
    const type_obj = this.ob$type;
    if ((args && args.length) || (kwargs && kwargs.length)) {
        if (type_obj.prototype.tp$new !== Sk.builtin.object.prototype.tp$new) {
            throw new Sk.builtin.TypeError("object.__new__() takes exactly one argument (the type to instantiate)");
        }
        if (type_obj.prototype.tp$init === Sk.builtin.object.prototype.tp$init) {
            throw new Sk.builtin.TypeError(Sk.abstr.typeName(this) + "() takes no arguments");
        }
    }
    return new this.constructor;
};

Sk.builtin.object.prototype.tp$init = function (args, kwargs) {
    // see cypthon object_init for reasoning behind errors
    const type_obj = this.ob$type;
    if ((args && args.length) || (kwargs && kwargs.length)) {
        if (type_obj.prototype.tp$init !== Sk.builtin.object.prototype.tp$init) {
            throw new Sk.builtin.TypeError("object.__init__() takes exactly one argument (the instance to initialize)");
        }
        if (type_obj.prototype.tp$new === Sk.builtin.object.prototype.tp$new) {
            throw new Sk.builtin.TypeError(Sk.abstr.typeName(this) + ".__init__() takes exactly one argument (the instance to initialize)");
        }
    }
    return Sk.builtin.none.none$;
};

/**
 * Python wrapper for `__repr__` method.
 * @name  __repr__
 * @memberOf Sk.builtin.object.prototype
 * @instance
 */
Sk.builtin.object.prototype["__repr__"] = function (self) {
    Sk.builtin.pyCheckArgsLen("__repr__", arguments.length, 0, 0, false, true);

    return self["$r"]();
};


Sk.builtin.object.prototype["__format__"] = function (self, format_spec) {
    var formatstr;
    Sk.builtin.pyCheckArgsLen("__format__", arguments.length, 2, 2);

    if (!Sk.builtin.checkString(format_spec)) {
        if (Sk.__future__.exceptions) {
            throw new Sk.builtin.TypeError("format() argument 2 must be str, not " + Sk.abstr.typeName(format_spec));
        } else {
            throw new Sk.builtin.TypeError("format expects arg 2 to be string or unicode, not " + Sk.abstr.typeName(format_spec));
        }
    } else {
        formatstr = Sk.ffi.remapToJs(format_spec);
        if (formatstr !== "") {
            throw new Sk.builtin.NotImplementedError("format spec is not yet implemented");
        }
    }

    return new Sk.builtin.str(self);
};


/**
 * Python wrapper for `__str__` method.
 * @name  __str__
 * @memberOf Sk.builtin.object.prototype
 * @instance
 */
Sk.builtin.object.prototype["__str__"] = function (self) {
    Sk.builtin.pyCheckArgsLen("__str__", arguments.length, 0, 0, false, true);

    return self["$r"]();
};

/**
 * Python wrapper for `__hash__` method.
 * @name  __hash__
 * @memberOf Sk.builtin.object.prototype
 * @instance
 */
Sk.builtin.object.prototype["__hash__"] = function (self) {
    Sk.builtin.pyCheckArgsLen("__hash__", arguments.length, 0, 0, false, true);

    return self.tp$hash();
};

/**
 * Python wrapper for `__eq__` method.
 * @name  __eq__
 * @memberOf Sk.builtin.object.prototype
 * @instance
 */
Sk.builtin.object.prototype["__eq__"] = function (self, other) {
    Sk.builtin.pyCheckArgsLen("__eq__", arguments.length, 1, 1, false, true);

    return self.ob$eq(other);
};

/**
 * Python wrapper for `__ne__` method.
 * @name  __ne__
 * @memberOf Sk.builtin.object.prototype
 * @instance
 */
Sk.builtin.object.prototype["__ne__"] = function (self, other) {
    Sk.builtin.pyCheckArgsLen("__ne__", arguments.length, 1, 1, false, true);

    return self.ob$ne(other);
};

/**
 * Python wrapper for `__lt__` method.
 * @name  __lt__
 * @memberOf Sk.builtin.object.prototype
 * @instance
 */
Sk.builtin.object.prototype["__lt__"] = function (self, other) {
    Sk.builtin.pyCheckArgsLen("__lt__", arguments.length, 1, 1, false, true);

    return self.ob$lt(other);
};

/**
 * Python wrapper for `__le__` method.
 * @name  __le__
 * @memberOf Sk.builtin.object.prototype
 * @instance
 */
Sk.builtin.object.prototype["__le__"] = function (self, other) {
    Sk.builtin.pyCheckArgsLen("__le__", arguments.length, 1, 1, false, true);

    return self.ob$le(other);
};

/**
 * Python wrapper for `__gt__` method.
 * @name  __gt__
 * @memberOf Sk.builtin.object.prototype
 * @instance
 */
Sk.builtin.object.prototype["__gt__"] = function (self, other) {
    Sk.builtin.pyCheckArgsLen("__gt__", arguments.length, 1, 1, false, true);

    return self.ob$gt(other);
};

/**
 * Python wrapper for `__ge__` method.
 * @name  __ge__
 * @memberOf Sk.builtin.object.prototype
 * @instance
 */
Sk.builtin.object.prototype["__ge__"] = function (self, other) {
    Sk.builtin.pyCheckArgsLen("__ge__", arguments.length, 1, 1, false, true);

    return self.ob$ge(other);
};

/** Default implementations of Javascript functions used in dunder methods */

/**
 * Return the string representation of this instance.
 *
 * Javascript function, returns Python object.
 *
 * @name  $r
 * @memberOf Sk.builtin.object.prototype
 * @return {Sk.builtin.str} The Python string representation of this instance.
 */
Sk.builtin.object.prototype["$r"] = function () {
    let mod, cname;
    if (this.ob$type.sk$type) {
        mod = this.ob$type.$typeLookup("__module__");
        cname = "";
        if (mod && Sk.builtin.checkString(mod)) {
            cname = mod.$jsstr() + ".";
        }
        return new Sk.builtin.str("<" + cname + Sk.abstr.typeName(this) + " object>");
    }
    return new Sk.builtin.str("<" + Sk.abstr.typeName(this) + " object>");
};

Sk.builtin.hashCount = 1;
Sk.builtin.idCount = 1;

/**
 * Return the hash value of this instance.
 *
 * Javascript function, returns Python object.
 *
 * @return {Sk.builtin.int_} The hash value
 */
Sk.builtin.object.prototype.tp$hash = function () {
    if (!this.$savedHash_) {
        this.$savedHash_ = new Sk.builtin.int_(Sk.builtin.hashCount++);
    }

    return this.$savedHash_;
};

/**
 * Perform equality check between this instance and a Python object (i.e. this == other).
 *
 * Implements `__eq__` dunder method.
 *
 * Javascript function, returns Python object.
 *
 * @param  {Object} other The Python object to check for equality.
 * @return {(Sk.builtin.bool|Sk.builtin.NotImplemented)} true if equal, false otherwise
 */
Sk.builtin.object.prototype.ob$eq = function (other) {
    if (this === other) {
        return Sk.builtin.bool.true$;
    }

    return Sk.builtin.NotImplemented.NotImplemented$;
};

/**
 * Perform non-equality check between this instance and a Python object (i.e. this != other).
 *
 * Implements `__ne__` dunder method.
 *
 * Javascript function, returns Python object.
 *
 * @param  {Object} other The Python object to check for non-equality.
 * @return {(Sk.builtin.bool|Sk.builtin.NotImplemented)} true if not equal, false otherwise
 */
Sk.builtin.object.prototype.ob$ne = function (other) {
    if (this === other) {
        return Sk.builtin.bool.false$;
    }

    return Sk.builtin.NotImplemented.NotImplemented$;
};

/**
 * Determine if this instance is less than a Python object (i.e. this < other).
 *
 * Implements `__lt__` dunder method.
 *
 * Javascript function, returns Python object.
 *
 * @param  {Object} other The Python object to compare.
 * @return {(Sk.builtin.bool|Sk.builtin.NotImplemented)} true if this < other, false otherwise
 */
Sk.builtin.object.prototype.ob$lt = function (other) {
    return Sk.builtin.NotImplemented.NotImplemented$;
};

/**
 * Determine if this instance is less than or equal to a Python object (i.e. this <= other).
 *
 * Implements `__le__` dunder method.
 *
 * Javascript function, returns Python object.
 *
 * @param  {Object} other The Python object to compare.
 * @return {(Sk.builtin.bool|Sk.builtin.NotImplemented)} true if this <= other, false otherwise
 */
Sk.builtin.object.prototype.ob$le = function (other) {
    return Sk.builtin.NotImplemented.NotImplemented$;
};

/**
 * Determine if this instance is greater than a Python object (i.e. this > other).
 *
 * Implements `__gt__` dunder method.
 *
 * Javascript function, returns Python object.
 *
 * @param  {Object} other The Python object to compare.
 * @return {(Sk.builtin.bool|Sk.builtin.NotImplemented)} true if this > other, false otherwise
 */
Sk.builtin.object.prototype.ob$gt = function (other) {
    return Sk.builtin.NotImplemented.NotImplemented$;
};

/**
 * Determine if this instance is greater than or equal to a Python object (i.e. this >= other).
 *
 * Implements `__ge__` dunder method.
 *
 * Javascript function, returns Python object.
 *
 * @param  {Object} other The Python object to compare.
 * @return {(Sk.builtin.bool|Sk.builtin.NotImplemented)} true if this >= other, false otherwise
 */
Sk.builtin.object.prototype.ob$ge = function (other) {
    return Sk.builtin.NotImplemented.NotImplemented$;
};

// Wrap the following functions in Sk.builtin.func once that class is initialized
/**
 * Array of all the Python functions which are methods of this class.
 * @type {Array}
 */
Sk.builtin.object.pythonFunctions = [
    "__repr__", "__str__", "__hash__",
    "__eq__", "__ne__", "__lt__", "__le__",
    "__gt__", "__ge__", "__getattribute__",
    "__setattr__", "__format__"
];

/**
 * @constructor
 * Sk.builtin.none
 *
 * @extends {Sk.builtin.object}
 */
Sk.builtin.none = function () {
    this.v = null;
};
Sk.abstr.setUpInheritance("NoneType", Sk.builtin.none, Sk.builtin.object);

/** @override */
Sk.builtin.none.prototype["$r"] = function () { return new Sk.builtin.str("None"); };

/** @override */
Sk.builtin.none.prototype.tp$hash = function () {
    return new Sk.builtin.int_(0);
};

/**
 * Python None constant.
 * @type {Sk.builtin.none}
 */
Sk.builtin.none.none$ = new Sk.builtin.none();

/**
 * @constructor
 * Sk.builtin.NotImplemented
 *
 * @extends {Sk.builtin.object}
 */
Sk.builtin.NotImplemented = function() { };
Sk.abstr.setUpInheritance("NotImplementedType", Sk.builtin.NotImplemented, Sk.builtin.object);

/** @override */
Sk.builtin.NotImplemented.prototype["$r"] = function () { return new Sk.builtin.str("NotImplemented"); };

/**
 * Python NotImplemented constant.
 * @type {Sk.builtin.NotImplemented}
 */
Sk.builtin.NotImplemented.NotImplemented$ = new Sk.builtin.NotImplemented();

Sk.exportSymbol("Sk.builtin.none", Sk.builtin.none);
Sk.exportSymbol("Sk.builtin.NotImplemented", Sk.builtin.NotImplemented);



