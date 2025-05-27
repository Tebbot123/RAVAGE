import { Service, OnStart } from "@flamework/core";
import { ServerStorage, Workspace } from "@rbxts/services";

const RoomsFolder: Folder = ServerStorage.FindFirstChild("Rooms") as Folder;

@Service({})
export class RoomService implements OnStart {
	onStart(): void {
		print("Making rooms...");
		this.generateRooms(1);
	}
	generateRooms(len: number) {
		const room = this.cloneRandomRoom();
		room.Parent = Workspace;
	}

	private cloneRandomRoom(): Model {
		return RoomsFolder.GetChildren()[math.random(1, RoomsFolder.GetChildren().size()) - 1].Clone() as Model;
	}
}
