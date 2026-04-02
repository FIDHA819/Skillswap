import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"

export default function OAuthSuccessPage() {

  const [params] = useSearchParams()

  useEffect(() => {

    const token =
      params.get("token")

    if (token) {

      localStorage.setItem(
        "token",
        token
      )

      window.location.href =
        "/dashboard"

    }

  }, [])

  return <p>Logging you in...</p>

}