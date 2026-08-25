"use client"

import { getSession, SessionProvider } from "next-auth/react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Session } from "next-auth"
import { usePathname } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AuthProviderProps {
  children: React.ReactNode
}

const SessionContent = createContext<Session | null>(null)

const ReactiveSessionProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const pathname = usePathname()
  const [session, setSession] = useState<Session | null>(null)
  const [isOpenExtend, setIsOpenExtend] = useState(false)

  const extendLogin = async () => {
    if (session?.expires) {
      await fetch(
        `${process.env.NEXT_PUBLIC_URL}/COMN9901/sessionExpireExtend.do`,
        { credentials: "include" },
      ).catch(() => {})
    }
    setIsOpenExtend(false)
    getSession().then((res) => {
      setSession(res)
    })
  }

  useEffect(() => {
    if (!session?.expires) {
      setIsOpenExtend(false)
      return
    }

    const timer = setInterval(() => {
      const remain = new Date(session.expires).getTime() - Date.now()

      if (remain <= 10 * 60 * 1000) {
        setIsOpenExtend(true)
      }
    }, 60 * 1000)

    return () => clearInterval(timer)
  }, [pathname, session])

  useEffect(() => {
    extendLogin().then()
  }, [pathname])
  return (
    <SessionContent.Provider value={session}>
      <Dialog open={isOpenExtend} onOpenChange={setIsOpenExtend}>
        <DialogContent className="p-8">
          <DialogHeader
            className={"flex flex-row items-center justify-between"}
          >
            <DialogTitle className={"font-bold"}>로그인 연장 안내</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <div>
              로그인이 약 10분 후 만료됩니다.
              <br />
              로그인을 연장하시겠습니까?
            </div>
            <div className="mt-8 flex gap-2 self-end">
              <Button variant="outline" onClick={() => setIsOpenExtend(false)}>
                닫기
              </Button>
              <Button onClick={extendLogin}>연장하기</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {children}
    </SessionContent.Provider>
  )
}

export const useSession = () => {
  return useContext(SessionContent)
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <SessionProvider refetchInterval={60} basePath={"/carbon/api/auth"}>
      <ReactiveSessionProvider>{children}</ReactiveSessionProvider>
    </SessionProvider>
  )
}

export default AuthProvider
