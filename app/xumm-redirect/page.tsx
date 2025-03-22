"use client"

import { useEffect } from "react"

export default function XummRedirect() {
  useEffect(() => {
    // 부모창에게 로그인 성공 메시지 전달
    if (window.opener) {
      window.opener.postMessage("xumm:signed", window.location.origin)
    }
  }, [])

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      로그인 완료! 잠시 후 창이 닫힙니다...
    </div>
  )
}
