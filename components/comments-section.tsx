"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Comentario } from "@/lib/services/types";
import { anuncioService } from "@/lib/services/anuncio.service";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

interface CommentsSectionProps {
  anuncioId: string;
  comentarios: Comentario[];
  onComentariosChange: (comentarios: Comentario[]) => void;
}

export default function CommentsSection({
  anuncioId,
  comentarios,
  onComentariosChange,
}: CommentsSectionProps) {
  const [novoComentario, setNovoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [respondendoComentario, setRespondendoComentario] = useState<
    string | null
  >(null);
  const [novaResposta, setNovaResposta] = useState("");
  const [enviandoResposta, setEnviandoResposta] = useState(false);

  const handleEnviarComentario = async () => {
    setEnviandoComentario(true);
    try {
      await anuncioService.comentar(anuncioId, novoComentario, null);
      setNovoComentario("");

      const comentarios = await anuncioService.listarComentarios(anuncioId);
      onComentariosChange(comentarios.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setEnviandoComentario(false);
    }
  };

  const handleEnviarResposta = async (comentarioId: string) => {
    setEnviandoResposta(true);
    try {
      await anuncioService.comentar(anuncioId, novaResposta, comentarioId);
      setNovaResposta("");
      setRespondendoComentario(null);

      const comentarios = await anuncioService.listarComentarios(anuncioId);
      onComentariosChange(comentarios.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setEnviandoResposta(false);
    }
  };

  const handleCancelarResposta = () => {
    setRespondendoComentario(null);
    setNovaResposta("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Comentários</h2>

      <div className="flex gap-3 mb-8">
        <Input
          placeholder="Escreva seu comentário..."
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleEnviarComentario();
            }
          }}
          className="flex-1"
        />
        <Button
          onClick={handleEnviarComentario}
          disabled={!novoComentario.trim() || enviandoComentario}
          className="px-6"
        >
          {enviandoComentario ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {comentarios.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
          </div>
        ) : (
          comentarios.map((comentario) => (
            <Card key={comentario.id} className="p-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {comentario.autor.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {comentario.autor}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comentario.criadoEm).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRespondendoComentario(comentario.id)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Responder
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {comentario.texto}
                  </p>

                  {comentario.respostas && comentario.respostas.length > 0 && (
                    <div className="ml-6 space-y-3 border-l-2 border-muted pl-4">
                      {comentario.respostas.map((resposta, index) => (
                        <div key={index} className="flex gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {resposta.autor.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-xs">
                                {resposta.autor}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(resposta.criadoEm).toLocaleDateString(
                                  "pt-BR",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {resposta.texto}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input para resposta */}
                  {respondendoComentario === comentario.id && (
                    <div className="mt-3 space-y-2">
                      <Input
                        placeholder="Escreva sua resposta..."
                        value={novaResposta}
                        onChange={(e) => setNovaResposta(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleEnviarResposta(comentario.id);
                          }
                        }}
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEnviarResposta(comentario.id)}
                          disabled={!novaResposta.trim() || enviandoResposta}
                        >
                          {enviandoResposta ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Send className="h-3 w-3" />
                          )}
                          Enviar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancelarResposta}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
