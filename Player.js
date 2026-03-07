import generateGUID from "./public/GUID";

class Player {
	constructor(name) {
		this.name = name;
		this.id = generateGUID();
	}
}

export default Player;
