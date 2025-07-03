"use client"

import ListingForm from "@/components/listing/listing-form"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function EditListingPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    fetch(`/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Carregando...</p>
  if (!data) return <p>Não foi possível carregar o anúncio.</p>

  return <ListingForm mode="edit" initialData={data} />
}
