import {environment} from "../../../environments/environment";
import {SavedData} from "../../Models/Interfaces";


export class FileEngine {

  fileName: string = 'savedText.txt';
  download: boolean;
  isInProduction = environment;

  constructor(download: boolean) {
    this.download = download;
  }
}
