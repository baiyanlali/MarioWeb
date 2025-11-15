
export default class MarioAgent {
    /**
     * initialize and prepare the agent before the game starts
     *
     * @param model a forward model object so the agent can simulate or initialize some parameters based on it.
     * @param timer amount of time before the agent has to return
     */
    initialize(model, timer){}

    /**
     * get mario current actions
     *
     * @param model a forward model object so the agent can simulate the future.
     * @param timer amount of time before the agent has to return the actions.
     * @return an array of the state of the buttons on the controller
     */
    getActions(model, timer){}

    /**
     * Return the name of the agent that will be displayed in debug purposes
     *
     * @return
     */
    getAgentName(){}

    toggleKey(key, isPressed){}

    reset() {}
}
