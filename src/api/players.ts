import { Router } from "express";
import { Player } from "../models/players";
import authMiddleware from '../middlewares/auth';

const router = Router();

type RequestBody = { text: string };
type RequestParams = { todoId: string };
type RequestQueries = { isCompleted?: string; searchTerm?: string };

let players: Player[] = [
    {
      "id": "0",
      "name": "Player 0",
      "position": "DF",
      "suspended": false,
      "injured": false
    },
    {
      "id": "1",
      "name": "Player 1",
      "position": "DF",
      "suspended": false,
      "injured": false
    },
    {
      "id": "2",
      "name": "Player 2",
      "position": "MD",
      "suspended": false,
      "injured": false
    },
    {
      "id": "3",
      "name": "Player 3",
      "position": "FW",
      "suspended": false,
      "injured": false
    },
    {
      "id": "4",
      "name": "Player 4",
      "position": "FW",
      "suspended": false,
      "injured": false
    },
    {
      "id": "5",
      "name": "Player 5",
      "position": "FW",
      "suspended": false,
      "injured": false
    },
    {
      "id": "6",
      "name": "Player 6",
      "position": "FW",
      "suspended": false,
      "injured": false
    },
    {
      "id": "7",
      "name": "Player 7",
      "position": "FW",
      "suspended": false,
      "injured": false
    },
    {
      "id": "8",
      "name": "Player 8",
      "position": "FW",
      "suspended": false,
      "injured": false
    },
    {
      "id": "9",
      "name": "Player 9",
      "position": "FW",
      "suspended": false,
      "injured": false
    },
    {
      "id": "10",
      "name": "Player 10",
      "position": "FW",
      "suspended": false,
      "injured": false
    },
    {
      "id": "11",
      "name": "Player 11",
      "position": "FW",
      "suspended": false,
      "injured": false
    },
    {
      "id": "12",
      "name": "Player 12",
      "position": "MD",
      "suspended": false,
      "injured": false
    },
    {
      "id": "13",
      "name": "Player 13",
      "position": "MD",
      "suspended": false,
      "injured": false
    },
    {
      "id": "14",
      "name": "Player 14",
      "position": "MD",
      "suspended": false,
      "injured": false
    },
    {
      "id": "15",
      "name": "Player 15",
      "position": "MD",
      "suspended": false,
      "injured": false
    },
    {
      "id": "16",
      "name": "Player 16",
      "position": "MD",
      "suspended": false,
      "injured": false
    },
    {
      "id": "17",
      "name": "Player 17",
      "position": "MD",
      "suspended": false,
      "injured": false
    },
    {
      "id": "18",
      "name": "Player 18",
      "position": "MD",
      "suspended": false,
      "injured": false
    },
    {
      "id": "19",
      "name": "Player 19",
      "position": "MD",
      "suspended": false,
      "injured": false
    },
    {
      "id": "20",
      "name": "Player 20",
      "position": "MD",
      "suspended": false,
      "injured": false
    },
    {
      "id": "21",
      "name": "Player 21 🥅",
      "position": "MD",
      "suspended": false,
      "injured": false
    },
    {
      "id": "22",
      "name": "Player 22 ❌ 🥅",
      "position": "MD",
      "suspended": false,
      "injured": false
    },
    {
      "id": "23",
      "name": "Player 23 🩼🤕🩼",
      "position": "MD",
      "suspended": false,
      "injured": true
    },
    {
      "id": "24",
      "name": "Player 🤬 🟥",
      "position": "MD",
      "suspended": true,
      "injured": false
    }
  ]
let callPlayers: Player[] = [];

//listado de jugadores
router.get('/players', authMiddleware, (req, res) =>{
    let playersList = players;
    if (!playersList){
        return res.status(200).json({ message: "No hay jugadores en la lista."});
    }
    return res.status(200).json({ players: playersList});
})  

//alta de jugador
//ADVERTENCIA: Se agrega un elemento null antes del jugador a agregar. Desconozco porqué
router.post('/players', authMiddleware, (req,res) =>{
    const { name, position, suspended, injured, called } = req.body;
    const possiblePosition = ["GK", "DF", "MD", "FW"];
    const idPlayer = players.length++;
    if (!name){
        return res.status(402).json({ message: "Falta  ingresar el nombre del jugador." });
    }
    if (!position || !possiblePosition.includes(position)){
        return res.status(402).json({ message: "Falta  ingresar la posición del jugador ó la posición ingresada no está permitida (GK, DF, MD, FW)." });
    }
    else{
        const newPlayer: Player = {
            id: idPlayer.toString(),
            name: name,
            position: position,
            suspended: suspended || false,
            injured: injured || false
        }
        players.push(newPlayer);
        return res.status(200).json({ message: "Jugador agergador correctamente." });
    }
})

//baja de jugador
//ADVERTENCIA: Al agregar un nuevo jugador se genera un elemento nulo antes de agergarlo, y al querer eliminar
//un jugador que esté después de este elemento, el algoritmo explota.
router.delete("/players/:id", authMiddleware, (req,res) => {
    const id = req.params.id;
    console.log("Id: " + id);
    let deletable = false;
    let playerIndex = -1;
    for (const player of players){
        if (player.id === id){
            console.log("Index del jugador: " + players.indexOf(player));
            playerIndex = players.indexOf(player);
            deletable = true;
        }
    }
    if (deletable){
        players.splice(playerIndex,1);        
        return res.status(200).json({ message: "Jugador eliminado correctamente." });
    }else{
        return res.status(403).json({ message: "El jugador no existe." });
    }
})

//listado de jugadores convocados
router.get("/call", authMiddleware, (req, res) => {
    if (callPlayers.length === 0){
        return res.status(200).json({ message: "No hay jugadores convocados." });
    }else{
        return res.status(200).json({ calledPlayers: callPlayers });
    }
})

//convocar jugadores
router.post("/call", authMiddleware, (req, res) => {
    const playersCalledID = req.body.calledPlayersId;
    let anySuspended = false;
    let anyInjured = false;
    let anyGK = false;
    let anyDF = false;
    let anyMD = false;
    let anyFW = false;
    console.log(playersCalledID.length);
    if(!(playersCalledID.length == 22)){
        return res.status(405).json({ message: "Debe convocar exactamente 22 jugadores." });
    }else{
        for (const id of playersCalledID){
            const calledPlayer = players[id];
            if (calledPlayer.suspended){
                anySuspended = true;
                break;
            }
            if (calledPlayer.injured){
                anyInjured = true;
                break;
            }
            if (calledPlayer.position === "GK"){
                anyGK = true;
            }
            if (calledPlayer.position === "DF"){
                anyDF = true;
            }
            if (calledPlayer.position === "MD"){
                anyMD = true;
            }
            if (calledPlayer.position === "FW"){
                anyFW = true;
            }
        }

        if (anySuspended || anyInjured){
            return res.status(406).json({ message: "Algún jugador está lesionado o suspendido."});
        }
        if (!anyGK){
            return res.status(406).json({ message: "Debe convocar al menos un goalkeeper."});
        }
        if (!anyDF){
            return res.status(406).json({ message: "Debe convocar al menos un defensor."});
        }
        if (!anyGK){
            return res.status(406).json({ message: "Debe convocar al menos un mediocampista."});
        }
        if (!anyGK){
            return res.status(406).json({ message: "Debe convocar al menos un delantero."});
        }else{
            callPlayers = playersCalledID;
            return res.status(200).json({message: "Los jugdaores han sido convocados correctamente."})
        }
    }
})

export default router;