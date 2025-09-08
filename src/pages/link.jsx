import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UrlState } from "../context";
import useFetch from "../hooks/use-fetch";
import { getUrl, deleteUrl } from "../db/apiUrls";
import { getClicks } from "../db/apiClicks";
import Error from "../components/error";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BeatLoader, BarLoader } from "react-spinners";

const Link = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = UrlState();

  // Fetch the link details
  const {
    loading: loadingUrl,
    error: errorUrl,
    data: url,
    fn: fnGetUrl,
  } = useFetch(getUrl, { id, user_id: user?.id });

  // Fetch clicks for this link
  const {
    loading: loadingClicks,
    error: errorClicks,
    data: clicks,
    fn: fnGetClicks,
  } = useFetch(getClicks, id ? [id] : []);

  // Delete link
  const {
    loading: loadingDelete,
    error: errorDelete,
    fn: fnDelete,
  } = useFetch(deleteUrl, id);

  useEffect(() => {
    fnGetUrl();
  }, []);

  useEffect(() => {
    if (id) fnGetClicks();
  }, [id]);

  const shareUrl = useMemo(() => {
    if (!url) return "";
    const alias = url.custom_url ? url.custom_url : url.short_url;
    return `${window.location.origin}/${alias}`;
  }, [url]);

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const handleOpen = () => {
    if (shareUrl) window.open(shareUrl, "_blank");
  };

  const handleDownloadQR = () => {
    if (!url?.qr) return;
    const a = document.createElement("a");
    a.href = url.qr;
    a.download = url.title || "qr-code";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = async () => {
    await fnDelete();
    if (!errorDelete) navigate("/dashboard");
  };

  return (
    <div className="flex flex-col gap-6">
      {(loadingUrl || loadingClicks) && (
        <BarLoader width={"100%"} color="#36d7b7" />
      )}

      {errorUrl && <Error message={errorUrl.message} />}
      {errorClicks && <Error message={errorClicks.message} />}
      {errorDelete && <Error message={errorDelete.message} />}

      {url && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{url.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Short Link</span>
                <span className="text-lg font-semibold text-blue-400 break-all">
                  {shareUrl}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Destination</span>
                <span className="break-all">{url.original_url}</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={handleCopy}>Copy</Button>
                <Button variant="outline" onClick={handleOpen}>Open</Button>
                <Button variant="outline" onClick={handleDownloadQR}>Download QR</Button>
                <Button variant="destructive" onClick={handleDelete} disabled={loadingDelete}>
                  {loadingDelete ? <BeatLoader size={8} color="white" /> : "Delete"}
                </Button>
              </div>

              {url.qr && (
                <img
                  src={url.qr}
                  alt="QR Code"
                  className="h-48 w-48 object-contain ring ring-blue-500 mt-2"
                />
              )}

              <div className="text-sm text-gray-400">
                Created: {new Date(url.created_at).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{clicks?.length || 0}</div>
              <div className="text-sm text-gray-400">Total clicks</div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Link;
