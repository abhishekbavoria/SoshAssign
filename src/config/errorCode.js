// this file used for storing error and their messages.

export default function CreateError(message, status = 400) {
    const err = new Error(message)
    err.status = status
    return err
}
