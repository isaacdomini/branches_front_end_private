import {IFirebaseRef} from '../../objects/interfaces';
import * as firebase from 'firebase';
import Reference = firebase.database.Reference;

export const separator = '__'
export function getContentUserId({contentId, userId}) {
    return contentId + separator + userId
}
export function getContentId({contentUserId}) {
    const contentId = contentUserId.substring(0, contentUserId.indexOf(separator))
    return contentId
}
export function getUserId({contentUserId}) {
    const start = contentUserId.indexOf(separator) + separator.length
    const end = contentUserId.length
    const userId = contentUserId.substring(start, end)
    return userId
}
export function getContentUserRef({contentUsersRef, contentId, userId, }: {
    contentUsersRef: Reference, contentId: string, userId: string,
}): Reference {
    const contentUserRef = contentUsersRef.child(contentId).child(userId)
    return contentUserRef
}
