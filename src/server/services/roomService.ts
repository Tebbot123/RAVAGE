import { Service, OnStart } from "@flamework/core";
import { ServerStorage, Workspace } from "@rbxts/services";
import CircularBuffer from "shared/utils/circularBuffer";
import { Room } from "../../../types/room";

const RoomsFolder: Folder = ServerStorage.FindFirstChild("Rooms") as Folder;
const RenderedRooms = Workspace.FindFirstChild("Rooms") as Folder;

const overlapParams = new OverlapParams();
overlapParams.FilterType = Enum.RaycastFilterType.Include;

@Service({})
export class RoomService implements OnStart {
	private roomLength: number = 10;
	private counter: number = 0;
	buffer = new CircularBuffer<Room>(10);

	onStart(): void {
		while (wait(5)[0]) {
			this.generateRooms();
		}
	}

	generateRooms() {
		let clonedRoom: Room | undefined;
		for (let i = 0; i < this.roomLength / 2; i++) {
			clonedRoom = this.cloneRandomRoom();
			clonedRoom.Name = tostring(this.counter);
			if (!clonedRoom.PrimaryPart) {
				clonedRoom.Destroy();
				continue;
			}

			// Positioning
			const lastRoom = this.buffer.last();

			if (lastRoom) {
				this.positionRoom(clonedRoom, lastRoom);
				while (this.checkOverlap(clonedRoom)) {
					clonedRoom = this.cloneRandomRoom();
					clonedRoom.Name = tostring(this.counter);
					if (!clonedRoom.PrimaryPart) {
						clonedRoom.Destroy();
						continue;
					}
					task.wait();
				}
			}

			const removed = this.buffer.enqueue(clonedRoom);
			clonedRoom.Parent = RenderedRooms;

			if (removed) {
				removed.Destroy();
			}

			this.counter++;
		}
		clonedRoom = undefined;
	}

	private checkOverlap(newRoom: Room): boolean {
		const MainChildren: Array<BasePart> = newRoom.Main.GetChildren() as Array<BasePart>;
		const FilterArray: BasePart[] = [];
		const RoomsChildren: Model[] = RenderedRooms?.GetChildren() as Model[];

		for (let i = 0; i < RoomsChildren.size(); i++) {
			const room = RoomsChildren[i];
			const Filtred = room.GetChildren().filter((c) => c.Name === "Main");
			Filtred.forEach((c) => {
				FilterArray.push(c as BasePart);
			});
		}

		overlapParams.FilterDescendantsInstances = FilterArray;

		for (let i = 0; i < MainChildren.size(); i++) {
			if (Workspace.GetPartsInPart(MainChildren[i], overlapParams).size() > 0) {
				return true;
			}
		}

		return false;
	}

	private positionRoom(newRoom: Room, lastRoom: Room) {
		const connectionRight = lastRoom.FindFirstChild("ConnectionRight") as BasePart;
		const connectionLeft = newRoom.PrimaryPart;

		newRoom.PivotTo(connectionRight.CFrame);
	}

	private cloneRandomRoom(): Room {
		return RoomsFolder.GetChildren()[math.random(1, RoomsFolder.GetChildren().size()) - 1].Clone() as Room;
	}
}
