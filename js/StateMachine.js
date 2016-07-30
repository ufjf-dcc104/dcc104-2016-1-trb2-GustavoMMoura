function StateMachine() {
    var states = new Map();
  
    var error = {
        addTransition: function(key, proxState) {
            return this;
        },
        prox: function(key) {
            return error;
        },
        value: function() {
            return false;
        }
    };
  
    function State(key) {
        var transitions = new Map();
        var key = key;
      
        this.addTransition = function(key, proxState) {
            transitions.set(key, proxState);
            return this;
        };
    
        this.prox = function(key) {
            var result = transitions.get(key);
            return typeof result === "undefined" ? false : result;
        };
    
        this.value = function() {
            return key;
        };
    }
  
    this.state = function(key) {
        var state = states.get(key);
        if (typeof state === "undefined") {
            state = new State(key);
            states.set(key, state);
        }
        return state;
    };
}