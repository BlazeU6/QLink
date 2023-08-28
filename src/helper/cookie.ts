const cookieObj = {
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    // 通过对获取的 cookie 值使用 decodeURIComponent 函数进行解码，确保返回的值是原始的、可读的 cookie 值，而不是编码后的字符序列。
    return match ? decodeURIComponent(match[3]) : null
  }
}
export default cookieObj
