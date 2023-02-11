import { toast } from "react-hot-toast";

export function notifyAwait() {
    
}
export function notifyUpdateSuccess(ID, text) {
    toast.update(text, {
        id: ID,
        style: loading
    })
}
export function notifyUpdateError() { }