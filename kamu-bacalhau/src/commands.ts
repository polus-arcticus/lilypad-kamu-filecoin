import { exec } from 'child_process'

export const add = async (filename: string) => {
  return await new Promise((res, rej) => {
    exec(`kamu add ${filename}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        res(error.message)
      }
      if (stderr) {
        console.error(`Command error: ${stderr}`);
        res(stderr)
      }
      console.log(`Command output: ${stdout}`);
      res(stdout)
    })
  })
}

export const pull = async (dataset: string) => {
 return await new Promise((res, rej) => {
   exec(`kamu pull ${dataset}`, (error, stdout, stderr) => {
     if (error) {
       console.error(`Error executing command: ${error.message}`);
       res(error.message)
     }
     if (stderr) {
       console.error(`Command error: ${stderr}`);
       res(stderr)
     }
     console.log(`Command output: ${stdout}`);
     res(stdout)
   })
 }) 
}

export const push = async (dataset: string, to: string) => {
    return await new Promise((res, rej) => {
      exec(`kamu push ${dataset} --to  ipns://${to}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error.message}`);
          res(error.message)
        }
        if (stderr) {
          console.error(`Command error: ${stderr}`);
          res(stderr)
        }
        console.log(`Command output: ${stdout}`);
        res(stdout)
      })
    })
  
}