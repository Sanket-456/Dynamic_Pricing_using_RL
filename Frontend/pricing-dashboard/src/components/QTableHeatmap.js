export default function QTableHeatmap({ Q }) {
  if (!Q) return null;

  return (
    <div className="card">
      <h3>Q-Table Heatmap</h3>
      <table style={{ width: "100%" }}>
        <tbody>
          {Q.map((row, i) => (
            <tr key={i}>
              {row.map((val, j) => (
                <td key={j} style={{
                  background: `rgba(34,197,94,${Math.abs(val)/100})`,
                  padding: "10px"
                }}>
                  {val.toFixed(1)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}