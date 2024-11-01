import request from '@/request'
import type { Result } from '@/api/models/Result'
import type { UploadRespDTO } from '@/api/models/fileUpload/UploadRespDTO'

export async function uploadFile(file: File){
    const formData = new FormData()
    formData.append('file', file)
    return request<any,Result<UploadRespDTO>>('/common/uploadFile', {
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}