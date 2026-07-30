interface AishkaShopProps {
  balance: number;
  hasTaser: boolean;
  onBuyTaser: () => void;
  onClose: () => void;
}

export function AishkaShop({
  balance, hasTaser, onBuyTaser, onClose,
}: AishkaShopProps) {
  const canBuy = balance >= 3 && !hasTaser;

  return (
    <div className="code-lock-backdrop">
      <section className="aishka-shop">
        <button className="code-lock__close" onClick={onClose}>×</button>
        <div className="aishka-shop__merchant">
          <span>👒</span>
          <div><p className="hud-label">Торговец</p><h2>Магазин Аишки</h2></div>
          <b>🟡 {balance}</b>
        </div>
        <p className="aishka-shop__speech">«Выбирай быстро, пока охрана не пришла!»</p>
        <article className="shop-product">
          <span className="shop-product__icon">⚡</span>
          <div>
            <h3>Электрошокер</h3>
            <p>Одноразово оглушает преследующего NPC на 5 секунд.</p>
          </div>
          <strong>🟡 3</strong>
          <button onClick={onBuyTaser} disabled={!canBuy}>
            {hasTaser ? 'Уже куплено' : balance < 3 ? 'Мало жетонов' : 'Купить'}
          </button>
        </article>
        <button className="ghost" onClick={onClose}>Закрыть магазин</button>
      </section>
    </div>
  );
}
