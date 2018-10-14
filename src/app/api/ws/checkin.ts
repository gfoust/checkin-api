import expressWs from 'express-ws';
import WebSocket from 'ws';
import Student from '../../../models/student';
import Action, { RequestLoadStudents, SetStudentStatus } from './Action';

let app: expressWs.Application;
let server: WebSocket.Server;

export function registerWs(wsInstance: expressWs.Instance) {
  app = wsInstance.app;
  server = wsInstance.getWss();

  app.ws('/ws/checkin', (ws, req) => {
    ws.on('message', msg => {
      try {
        console.log('WS /ws/checkin ', msg);
        const action = JSON.parse(msg.toString());
        dispatchAction(action, ws);
      }
      catch (err) {
        console.error(err);
      }
    });
  });
}

async function loadStudents(action: RequestLoadStudents, ws: WebSocket) {
  const students: Student[] = await Student.find({}).populate('class') || [ ];

  ws.send(JSON.stringify({
    type: 'ServerLoadStudents',
    students,
  }));
}

async function setStudentStatus(action: SetStudentStatus) {
  const student = await Student.findById(action.studentId).populate('class');
  try {
    if (student) {
      if (student.status !== action.status) {
        student.status = action.status;
        await student.save();
        const message = JSON.stringify({
          type: 'ServerUpdateStudent',
          student,
        });
        for (const client of server.clients) {
          client.send(message);
        }
      }
    }
    else {
      console.error('Could not find requested student: ', action.studentId);
    }
  }
  catch (err) {
    console.error(err);
  }
}

export async function reportUpdatedStudent(student: Student) {
  const message = JSON.stringify({
    type: 'ServerUpdateStudent',
    student,
  });
  for (const client of server.clients) {
    client.send(message);
  }
}

export async function reportNewStudent(student: Student) {
  const message = JSON.stringify({
    type: 'ServerAddStudent',
    student,
  });
  for (const client of server.clients) {
    client.send(message);
  }
}

export async function reportDeletedStudent(student: Student) {
  const message = JSON.stringify({
    type: 'ServerRemoveStudent',
    studentId: student.id,
  });
  for (const client of server.clients) {
    client.send(message);
  }
}

function dispatchAction(action: Action, ws: WebSocket) {
  switch (action.type) {
    case 'RequestLoadStudents':
      loadStudents(action, ws);
      break;
    case 'SetStudentStatus':
      setStudentStatus(action);
      break;
  }
}
