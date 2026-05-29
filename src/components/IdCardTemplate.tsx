export default function IdCardTemplate({ player, team }: any) {
  return (
    <div
      style={{
        width: "400px",
        height: "250px",
        background: "linear-gradient(135deg,#0f172a,#000)",
        color: "white",
        padding: "20px",
        borderRadius: "20px",
        border: "2px solid cyan",
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>
        DOMIFLAME ESPORTS
      </h2>

      <p>{team.teamName}</p>

      <hr />

      <h3>{player.name}</h3>
      <p>UID: {player.uid}</p>
      <p>Role: {player.role}</p>
      <p>Gender: {player.gender || "-"}</p>

      {/* QR */}
{player.qrCode ? (
  <img
    src={player.qrCode}
    width={80}
    height={80}
    crossOrigin="anonymous"
    style={{ width: 80, height: 80 }}
  />
) : (
  <p>QR loading...</p>
)}

      <p>ID: {player.playerId}</p>
    </div>

  );
}