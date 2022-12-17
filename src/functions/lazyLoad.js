import { lazy } from "react";

export function lazyLoad(path, namedExport) {
    return lazy(async () => {
        const promise = import(path)
        console.log(promise)
        if (namedExport == null) {
            return promise
        } else {
            const module = await promise;
            return ({ default: module[namedExport] });
        }
    })
}