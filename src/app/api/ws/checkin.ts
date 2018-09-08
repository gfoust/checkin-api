import expressWs from 'express-ws';
import WebSocket from 'ws';
import Student from '../../../models/student';
import { Dictionary } from '../../../util';
import Action, { RequestLoadStudents } from './Action';

async function loadStudents(action: RequestLoadStudents, ws: WebSocket) {
  const students: Dictionary<Student> = { };

  for (const student of await Student.find({}).populate('class')) {
    students[student.id] = student;
  }

  ws.send(JSON.stringify({
    type: 'ServerLoadStudents',
    students,
  }));
}

function dispatchAction(action: Action, ws: WebSocket) {
  switch (action.type) {
    case 'RequestLoadStudents':
      loadStudents(action, ws);
      break;
  }
}

export function registerWs(wsInstance: expressWs.Instance) {
  const app = wsInstance.app;
  const server = wsInstance.getWss();

  app.ws('/ws/checkin', (ws, req) => {
    ws.on('message', (msg) => {
      try {
        const action = JSON.parse(msg.toString());
        dispatchAction(action, ws);
      }
      catch (err) {
        console.error(err);
      }
    });
  });
}
