// 公共方法

interface FileCondition {
  format?: string[];
  size?: number;
}

// 自定义类型
type ErrorType = 'format' | 'size' | null

export function checkBeforeUpload (file: File, condition: FileCondition) {
  const { format, size } = condition
  const isValidFormat = format ? format.includes(file.type) : true
  const isValidSize = size ? (file.size / 1024 / 1024) <= size : true
  let errorInfo: ErrorType = null
  if (!isValidFormat) {
    errorInfo = 'format'
  }
  if (!isValidSize) {
    errorInfo = 'size'
  }
  return {
    passed: isValidSize && isValidFormat,
    errorInfo
  }
}
